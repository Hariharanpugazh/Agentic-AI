from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
from .logic import run_agentic_review

@csrf_exempt
def review_repo(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            repo_url = data.get("repo_url")

            if not repo_url:
                return JsonResponse({"error": "Missing repo_url"}, status=400)

            review_result = run_agentic_review(repo_url)
            return JsonResponse({"review": review_result}, status=200)

        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)

    return JsonResponse({"error": "Invalid request method"}, status=405)